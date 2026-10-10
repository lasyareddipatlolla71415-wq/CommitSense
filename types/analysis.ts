export type GraphNode = {
  id: string;
  type: string;
  technology: string;
};

export type GraphEdge = {
  source: string;
  target: string;
  type: string;
};

export type HistoricalMatch = {
  run_id: string;
  created_at: string;
  root_cause: string | null;
  resolution_status: string | null;
  error_summary: string | null;
};

export type HistoricalComparison = {
  previous_run_id: string;
  previous_root_cause: string | null;
  previous_confidence: number | null;
  previous_resolution: string | null;
  occurrence_count: number;
  regression_suspected: boolean;
  findings: string[];
};

export type AnalysisResult = {
  root_cause: string;
  confidence: number;
  explanation: string;
  evidence: string[];
  recommended_fixes: string[];
  verification_steps: string[];
  affected_node: string | null;
  affected_technology: string | null;
  graph_confidence: number;
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  historical_matches: HistoricalMatch[];
  historical_comparison: HistoricalComparison | null;
  run_id: string | null;
  project_id: string | null;
  commit_sha: string | null;
};

export type RunRecord = {
  run_id: string;
  created_at: string;
  status: string;
  error_summary: string;
  affected_component: string | null;
  root_cause: string | null;
  resolution_status: string;
};