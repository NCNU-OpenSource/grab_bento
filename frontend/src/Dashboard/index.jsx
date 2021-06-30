import React, { useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import DataTable from "./DataTable";

function Index() {

  return (
    <MDBContainer className="mt-5">
      <h2>暨大便當狩獵器</h2>
      <MDBRow className="w-100">
        <DataTable></DataTable>
      </MDBRow>
    </MDBContainer>
  );
}

export default Index;
