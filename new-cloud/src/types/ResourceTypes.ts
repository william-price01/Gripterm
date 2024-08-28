// STRUCTURES ---------------------------------------------
export type StructureDetail = {
  structure_id: string;
  name: string;
  description: string;
  code: StructureCode;
  structure_config_file?: string;
  created_at: string;
  updated_at: string;
  organization_id: string;
  created_by: string;
  env_vars: StructureEnvVar[];
  latest_deployment_id: string;
};
export type StructureCode = {
  github: GithubStructureCode;
};
export type GithubStructureCode = {
  owner: string;
  name: string;
  push: GithubStructureCodePushConfig;
};
export type GithubStructureCodePushConfig = {
  branch: string;
  tag?: string;
};
export type StructureEnvVar = {
  name: string;
  source: StructureEnvVarSource;
  value: string;
};
export type StructureEnvVarSource = "secret_ref" | "manual";
// KNOWLEDGE_BASES ---------------------------------------------
