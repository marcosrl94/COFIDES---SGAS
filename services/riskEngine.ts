import { ProjectState, AssessmentResult, Question } from '../types';
import { CLAUSE_TEMPLATES } from '../constants';

export const calculateRisk = (
  state: ProjectState,
  questions: Question[]
): AssessmentResult => {
  const hasLocations = state.locations && state.locations.length > 0;
  if (!state.sector || (!state.country && !hasLocations)) {
    throw new Error("Datos incompletos para el cálculo");
  }

  // 1. RATING A: RIESGO INHERENTE (Sector + País Ponderado)
  
  // Calcular Riesgo País Ponderado
  let weightedCountryRisk = 0;
  
  if (hasLocations) {
    let totalPercent = 0;
    let weightedSum = 0;

    state.locations.forEach(loc => {
      weightedSum += (loc.country.riskScore * loc.revenuePercentage);
      totalPercent += loc.revenuePercentage;
    });

    // Si los porcentajes no suman 100, normalizamos o asumimos que el resto es riesgo medio (3) o bajo (1)?
    // Para simplificar, dividimos por el total reportado.
    if (totalPercent > 0) {
      weightedCountryRisk = weightedSum / totalPercent;
    } else {
      weightedCountryRisk = state.country?.riskScore || 3;
    }
  } else {
    // Fallback single country
    weightedCountryRisk = state.country?.riskScore || 3;
  }

  // Promedio ponderado: Sector pesa 60%, País pesa 40%
  const inherentScore = (state.sector.inherentRisk * 0.6) + (weightedCountryRisk * 0.4);

  // 2. RATING B: RIESGO DE GESTIÓN (Respuestas del cliente)
  // Calculamos % de cumplimiento.
  let totalPoints = 0;
  let earnedPoints = 0;
  const missingPolicies: string[] = [];
  const riskFactorsTriggered = new Set<string>();

  questions.forEach(q => {
    const answer = state.answers[q.id];
    
    // Solo contamos preguntas contestadas (aunque en el UI forzamos todas)
    if (answer !== undefined) {
      totalPoints++;
      if (answer === true) {
        earnedPoints++;
      } else {
        // Respuesta negativa -> Genera Acción y Cláusula potencial
        missingPolicies.push(q.text.replace('¿', '').replace('?', ''));
        riskFactorsTriggered.add(q.riskFactor);
      }
    }
  });

  // Escala de gestión invertida: Más puntos = Menor Riesgo Residual
  // 0% compliance = 5 (High Residual Risk), 100% compliance = 1 (Low Residual Risk)
  const complianceRatio = totalPoints > 0 ? earnedPoints / totalPoints : 0;
  const managementRiskScore = 5 - (complianceRatio * 4); // Maps 0..1 to 5..1

  // 3. MATRIZ FINAL (Promedio de ambos o lógica de "peor caso")
  const finalScore = (inherentScore + managementRiskScore) / 2;

  let finalRiskRating: 'Bajo' | 'Medio' | 'Alto' | 'Crítico' = 'Bajo';
  if (finalScore >= 4) finalRiskRating = 'Crítico';
  else if (finalScore >= 3) finalRiskRating = 'Alto';
  else if (finalScore >= 2) finalRiskRating = 'Medio';

  // 4. GENERAR OUTPUTS
  const requiredActions = missingPolicies.map(policy => 
    `Acción Requerida: Implementar/Formalizar "${policy}" antes del primer desembolso.`
  );

  const suggestedClauses = Array.from(riskFactorsTriggered).map(factor => {
    return CLAUSE_TEMPLATES[factor] || CLAUSE_TEMPLATES['General'];
  });

  // Si el riesgo inherente es alto, añadir cláusula general siempre
  if (inherentScore > 3.5) {
    suggestedClauses.push(CLAUSE_TEMPLATES['General']);
  }

  return {
    inherentRisk: inherentScore,
    managementQuality: managementRiskScore,
    finalRiskRating,
    requiredActions,
    suggestedClauses: [...new Set(suggestedClauses)] // Remove duplicates
  };
};