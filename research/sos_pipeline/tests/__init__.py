"""
Tests for the collection pipeline.

Standard-library `unittest`, no network, no test dependency. Run them all with:

    cd research
    python -m unittest discover -s sos_pipeline/tests -t .

The suite is weighted toward the invariants that would be expensive to discover
late: the harvest/coder boundary, identifier allocation, and the merge that
must never overwrite a human judgement.
"""
