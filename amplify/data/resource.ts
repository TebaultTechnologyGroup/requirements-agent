import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { generatePRD } from '../functions/generatePRD/resource';
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a.schema({
  // Custom mutation to generate PRD via Lambda
  generatePRD: a
    .mutation()
    .arguments({
      title: a.string().required(),
      idea: a.string().required(),
      targetMarket: a.string().required(),
      constraints: a.string(),
      additionalContext: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(generatePRD)),

  UserProfile: a
    .model({
      userId: a.string().required(),
      email: a.string().required(),
      role: a.enum(['USER', 'ADMIN']),
      plan: a.enum(['FREE', 'PRO', 'ENTERPRISE']),
      generationsThisMonth: a.integer().default(0),
      monthResetDate: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.ownerDefinedIn("userId"),
      allow.authenticated().to(['read']),
      allow.groups(["ADMINS"]).to(["read", "update", "delete"])
    ]),

  Generation: a
    .model({
      title: a.string().required(),
      userId: a.string().required(),
      idea: a.string().required(),
      targetMarket: a.string().required(),
      constraints: a.string(),
      additionalContext: a.string(),

      // Output fields
      productRequirements: a.json(),
      userStories: a.json(),
      risks: a.json(),
      mvpScope: a.json(),

      // Metadata
      status: a.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
      completedAt: a.datetime(),
      errorMessage: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.groups(["ADMINS"]).to(["read", "update", "delete"])
    ]),

  PlanQuota: a
    .model({
      plan: a.enum(['FREE', 'PRO', 'ENTERPRISE']),
      monthlyLimit: a.integer().required(),
      description: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.guest().to(['read']),
      allow.groups(["ADMINS"]).to(["read", "update", "delete"])
    ]),
}).authorization(allow => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});