import os
import sys
from dotenv import load_dotenv
from griptape.rules import Rule, Ruleset
from griptape.structures import Agent
from griptape.drivers import LocalStructureRunDriver
from database_agent import init_database_structure

# Load environment variables
def load_env_variables():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(os.path.dirname(os.path.dirname(current_dir)), ".env")
    load_dotenv(env_path)


# Define rulesets
def get_rulesets():
    return [
        Ruleset(
            name="Cloud-Agent",
            rules=[
                Rule("You are an intelligent agent tasked with helping users find information about their griptape cloud resources."),
                Rule("Help users by fetching relevant information using your tools and responding to their queries."),
                Rule("Never make up data. If you don't know the answer, and the tools can't provide the information, then say so.")
            ]
        )
    ]
from griptape.tools import StructureRunTool
# Initialize terminal structure
def init_terminal_structure() -> Agent:
    rulesets = get_rulesets()

    agent = Agent(
        rulesets=rulesets,
        tools=[
            StructureRunTool(
                driver=LocalStructureRunDriver(
                    structure_factory_fn=init_database_structure
                ),
                description="Intelligent Database agent with access to the Griptape Cloud service APIs, such as: DataConnectors, DataJobs, Deployments, Events, KnowledgeBases, Users, Organizations, Structures, and StructureRuns.",
                off_prompt=False,
                name="DatabaseAgent",
            ),
        ]
    )
    return agent

def main():
    load_env_variables()
    agent = init_terminal_structure()
    agent.run(*sys.argv[1:])

if __name__ == "__main__":
    main()
