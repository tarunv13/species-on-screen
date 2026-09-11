"""
Species on Screen — research collection pipeline.

Two planes, deliberately separated:

  harvest plane   Machine work. Talks to media and biodiversity APIs, records
                  what was asked and what came back, and persists raw payloads
                  with provenance. Interprets nothing.

  corpus plane    Human work. Receives `candidate` rows carrying only the
                  core-metadata columns of the corpus schema. Every
                  interpretive field stays empty until a coder fills it.

The boundary between them is not a style preference: it is
`.agents/tasks/task-pilot-execution/coding-workspace-spec.md` §17, which holds
the coding workflow manual for the duration of the pilot.
"""

__version__ = "0.1.0"

PIPELINE_NAME = "species-on-screen/research-pipeline"
