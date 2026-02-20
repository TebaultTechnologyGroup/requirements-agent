import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { generatePRD } from './functions/generatePRD/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';


const backend = defineBackend({
  auth,
  data,
  generatePRD
});


// generatePRD policy
backend.generatePRD.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel'],
    resources: ['*'],
  })
);


