import json

DATA_CONNECTOR_SCHEMA = json.dumps({
    "type": "object",
    "properties": {
        "name": {"type": "string", "maxLength": 200},
        "description": {"type": "string", "maxLength": 200},
        "schedule_expression": {"type": "string", "maxLength": 200},
        "type": {
            "type": "string",
            "enum": ["confluence", "google_drive", "temp_google_drive", "file_upload", "webscraper", "structure"]
        },
        "config": {
            "type": "object",
            "oneOf": [
                {
                    "type": "object",
                    "properties": {
                        "confluence": {
                            "type": "object",
                            "properties": {
                                "domain": {"type": "string"},
                                "atlassian_email": {"type": "string"}
                            },
                            "required": ["domain", "atlassian_email"]
                        }
                    },
                    "required": ["confluence"]
                },
                {
                    "type": "object",
                    "properties": {
                        "google_drive": {
                            "type": "object",
                            "properties": {
                                "file_ids": {
                                    "type": "array",
                                    "items": {"type": "string"}
                                }
                            },
                            "required": ["file_ids"]
                        }
                    },
                    "required": ["google_drive"]
                },
                {
                    "type": "object",
                    "properties": {
                        "webscraper": {
                            "type": "object",
                            "properties": {
                                "url": {"type": "string"}
                            },
                            "required": ["url"]
                        }
                    },
                    "required": ["webscraper"]
                }
                # Add other configuration types as needed
            ]
        }
    },
    "required": ["name", "type", "config"]
})
SCHEMAS = {
    "data_connector": DATA_CONNECTOR_SCHEMA
}
