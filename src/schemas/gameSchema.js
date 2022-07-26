import Joi from "joi";

export const gameSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().pattern(
    /http(s?):([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/i
  ),
  categoryId: Joi.number().required(),
  stockTotal: Joi.number().greater(0).required(),
  pricePerDay: Joi.number().greater(0).required(),
});
