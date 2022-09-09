import { Context, Handler } from "aws-lambda";

export const handler: Handler = async (event, context: Context) => {
  console.log(event);
  console.log(context);
};
