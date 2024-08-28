import { StructureDetail } from "../types/ResourceTypes";
function toGithhubRepoUrl(structure: StructureDetail): string | undefined {
  const code = structure?.code;
  const github = code?.github;
  if (!github) {
    return undefined;
  }
  const owner = github.owner;
  const repo = github.name;
  const branchOrTag = github.push.tag || github.push.branch;
  const structureConfigFile =
    structure.structure_config_file ?? "structure_config.yaml";

  return `https://github.com/${owner}/${repo}/tree/${branchOrTag}/${structureConfigFile}`;
}
export default toGithhubRepoUrl;
