import os
from dotenv import load_dotenv
from griptape.structures import Agent
from griptape.rules import Rule, Ruleset
from griptape.tools import RestApiTool
from api_schemas import SCHEMAS
import requests
import json
from collections import OrderedDict

def load_env_variables():
    load_dotenv()
    return {
        "base_url": os.environ.get("API_URL"),
        "auth0_domain": os.environ["AUTH0_PROVIDER_DOMAIN"],
        "auth0_client_id": os.environ["AUTH0_PROVIDER_CLIENT_ID"],
        "auth0_client_secret": os.environ["AUTH0_PROVIDER_CLIENT_SECRET"],
        "auth0_audience": os.environ["AUTH0_API_AUDIENCE"],
    }

def get_auth0_token(env_vars):
    url = f"https://{env_vars['auth0_domain']}/oauth/token"
    payload = {
        "client_id": env_vars["auth0_client_id"],
        "client_secret": env_vars["auth0_client_secret"],
        "audience": env_vars["auth0_audience"],
        "grant_type": "client_credentials"
    }
    headers = {"content-type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()  # Raise an exception for HTTP errors
    return response.json()["access_token"]

def get_rulesets():
    return [
        Ruleset(
            name="Griptape Cloud API Agent",
            rules=[
                   Rule("You can only return information in JSON Format."),
                   Rule("You are an intelligent agent with access to the Griptape Cloud service API."),
                   Rule("Help users by fetching relevant information using the provided API tools and responding to their queries."),
                   Rule("Present the information in a clear and organized manner."),
                   Rule("If you don't have enough information to complete a request, ask the user for clarification."),
                   Rule("Use the most specific API tool for each query to ensure accurate and relevant responses."),
                   Rule("For each response, provide an identifier that best describes the type of information or action. Use the format 'identifier: <Identifier Name>'."),
                   Rule("When listing resources always start with 'List' in the identifier followed by the plural form of the resource type. For example, 'identifier: List Structures', 'identifier: List Data Connectors', 'identifier: List Knowledge Bases'."),
                   Rule("When fetching details for a specific resource, use the singular form of the resource type followed by 'Detail' in the identifier. For example, 'identifier: Structure Detail', 'identifier: Data Connector Detail', 'identifier: Deployment Detail'."),
                   Rule("Common identifiers for listing include: List Structures, List Data Connectors, List Knowledge Bases, List API Keys, List Secrets."),
                   Rule("Common identifiers for details include: Structure Detail, Data Connector Detail, Knowledge Base Detail, Deployment Detail, Data Job Status, Structure Run Detail."),
                   Rule("Always use the exact resource type names as provided in the API tools. Do not abbreviate or modify the resource type names."),
                   Rule("Ensure that the identifier accurately reflects the content of your response."),
            ],
        ),
    ]

class GriptapeCloudAgent:
    def __init__(self):
        self.env_vars = load_env_variables()
        self.auth_token = get_auth0_token(self.env_vars)
        self.rulesets = get_rulesets()
        self.agent = self._create_agent()

    def _create_agent(self):
        api_tools = [
            RestApiTool(
                name="StructuresAPI",
                description="Fetch information about Griptape Cloud Structures",
                base_url=self.env_vars["base_url"],
                path="/api/structures",
                request_headers={"Authorization": f"Bearer {self.auth_token}"},
            ),
            RestApiTool(
                name="UsersAPI",
                description="Fetch information about Griptape Cloud Users",
                base_url=self.env_vars["base_url"],
                path="/api/users",
                request_headers={"Authorization": f"Bearer {self.auth_token}"},
            ),
            RestApiTool(
                name="DeploymentsAPI",
                description="Fetch information about Griptape Cloud Deployments",
                base_url=self.env_vars["base_url"],
                path="/api/deployments",
                request_headers={"Authorization": f"Bearer {self.auth_token}"},
            ),
            RestApiTool(
                name="DataConnectorsAPI",
                description="Fetch information about Griptape Cloud Data Connectors",
                base_url=self.env_vars["base_url"],
                path="/api/data-connectors",
                request_headers={"Authorization": f"Bearer {self.auth_token}"},
            ),
            RestApiTool(
                name="DataJobsAPI",
                description="Fetch information about Griptape Cloud Data Jobs",
                base_url=self.env_vars["base_url"],
                path="/api/data-jobs",
                request_headers={"Authorization": f"Bearer {self.auth_token}"},
            ),
            RestApiTool(
                name="KnowledgeBasesAPI",
                description="Fetch information about Griptape Cloud Knowledge Bases",
                base_url=self.env_vars["base_url"],
                path="/api/knowledge-bases",
                request_headers={"Authorization": f"Bearer {self.auth_token}"},
            ),
            RestApiTool(
                name="StructureRunsAPI",
                description="Fetch information about Griptape Cloud Structure Runs",
                base_url=self.env_vars["base_url"],
                path="/api/structure-runs",
                request_headers={"Authorization": f"Bearer {self.auth_token}"},
            ),
        ]

        return Agent(
            rulesets=self.rulesets,
            tools=api_tools,
        )

    def process_query(self, query):
        try:
            response = self.agent.run(query)
            output = str(response.output_task.output)

            # Extract the JSON part from the output
            json_start = output.find('```json')
            json_end = output.rfind('```')
            if json_start != -1 and json_end != -1:
                json_str = output[json_start+7:json_end].strip()
                data = json.loads(json_str)

                # Extract identifier and response
                identifier = data.get('identifier', 'General Information')
                response_data = {k: v for k, v in data.items() if k != 'identifier'}

                return {
                    "identifier": identifier,
                    "response": json.dumps(response_data)
                }
            else:
                # If no JSON is found, return the whole output as response
                return {
                    "identifier": "General Information",
                    "response": output
                }
        except Exception as e:
            return {
                "identifier": "Error",
                "response": f"Error processing query: {str(e)}"
            }
def create_agent():
    return GriptapeCloudAgent()
