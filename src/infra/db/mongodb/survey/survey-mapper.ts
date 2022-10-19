import { AddSurveyModel } from '../../../../domain/usecases/add-survey';

export const map = (survey: any): AddSurveyModel => {
  const { _id, ...surveyWithouthId } = survey;
  return Object.assign({}, surveyWithouthId, { id: _id });
};
