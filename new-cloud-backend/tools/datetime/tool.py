from datetime import datetime
from datetime import UTC
from schema import Schema, Literal
from griptape.artifacts import BaseArtifact, ErrorArtifact, TextArtifact
from griptape.tools import BaseTool
from griptape.utils.decorators import activity


class DateTime(BaseTool):
    @activity(
        config={"description": "Can be used to return current date and time in UTC."}
    )
    def get_current_datetime(self, _: dict) -> BaseArtifact:
        try:
            current_datetime = datetime.now(UTC)

            return TextArtifact(str(current_datetime))
        except Exception as e:
            return ErrorArtifact(f"error getting current datetime: {e}")

    @activity(
        config={
            "description": "Can be used to return a relative date and time.",
            "schema": Schema(
                {
                    Literal(
                        "relative_date_string",
                        description='Relative date in English. For example, "now UTC", "20 minutes ago", '
                        '"in 2 days", "3 months, 1 week and 1 day ago", or "yesterday at 2pm"',
                    ): str
                }
            ),
        }
    )
    def get_relative_datetime(self, params: dict) -> BaseArtifact:
        from dateparser import parse

        try:
            date_string = params["values"]["relative_date_string"]
            relative_datetime = parse(date_string, settings={"TIMEZONE": "UTC"})

            if relative_datetime:
                return TextArtifact(str(relative_datetime))
            else:
                return ErrorArtifact("invalid date string")
        except Exception as e:
            return ErrorArtifact(f"error getting current datetime: {e}")
