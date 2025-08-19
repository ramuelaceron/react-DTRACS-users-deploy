import React from "react";
import "./PlanningResearch.css";

const PlanningResearch = () => {
  return (
    <div className="planning-research">
      {/* Page Header */}
      <header className="planning-header">
        <h1>Planning and Research Section</h1>
        <p>
          Welcome to the Planning and Research section. This page will contain
          reports, analysis tools, and resources for school governance and
          decision-making.
        </p>
      </header>

      {/* Example Content */}
      <div className="planning-content">
        <section className="planning-card">
          <h2>📊 Research Reports</h2>
          <p>Access, upload, and manage research reports here.</p>
        </section>

        <section className="planning-card">
          <h2>📝 Planning Tools</h2>
          <p>Use interactive tools for planning and evaluation.</p>
        </section>

        <section className="planning-card">
          <h2>📂 Data Archives</h2>
          <p>Browse archived research documents and references.</p>
        </section>
      </div>
    </div>
  );
};

export default PlanningResearch;
