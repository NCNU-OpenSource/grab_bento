import * as React from "react";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { headCells as columns, data as eventData } from "./events_data";
import { get_all_event, create_enroll, delete_enroll } from "../api/server";
import { useSnackbar } from "notistack";

const EnrollModal = ({ isModalOpen, setIsModalOpen, modalPointedID, rows, hendle_get_all_data }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const filteredRow = rows.filter((res) => res.id === modalPointedID)[0];
  const handleEnroll = async () => {
    setIsLoading(true);

    const enrollEventHandler = filteredRow.is_reserved
      ? delete_enroll
      : create_enroll;
    const action = filteredRow.is_reserved ? "取消" : "註冊";

    await enrollEventHandler({ event_id: filteredRow.id })
      .then((res) => {
        enqueueSnackbar(<div data-testid="notiBox">{`成功${action}`}</div>, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 1500,
        });
      })
      .catch((err) => {
        enqueueSnackbar(<div data-testid="notiBox">{`${action}失敗`}</div>, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 1500,
        });
        console.log(err);
      })
      .finally(() => {
        setIsModalOpen(false);
        setIsLoading(false);
        hendle_get_all_data();
      });
  };

  return (
    !!filteredRow && (
      <MDBModal
        show={isModalOpen}
        getOpenState={(e) => {
          if (isLoading) setIsModalOpen(true);
          setIsModalOpen(e);
        }}
        data-testid="enrollModal"
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>{`確認是否${
                filteredRow.is_reserved ? "取消" : "預約"
              }`}</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  if (isLoading) return;
                  setIsModalOpen(!isModalOpen);
                }}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {`即將${filteredRow.is_reserved ? "取消" : "預約"} ${
                filteredRow.event_name
              }`}
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => {
                  if (isLoading) return;
                  setIsModalOpen(!isModalOpen);
                }}
                disabled={isLoading}
                data-testid="canelEnrollBtn"
              >
                否
              </MDBBtn>
              <MDBBtn
                disabled={isLoading}
                onClick={handleEnroll}
                data-testid="enrollBtn"
              >
                {isLoading ? (
                  <CircularProgress size="1em" color="inherit" />
                ) : (
                  "是"
                )}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    )
  );
};

function DataTable() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [cols, setCols] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [modalPointedID, setModalPointedID] = React.useState(0);
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleOpenModal = (id) => {
    setModalPointedID(id);
    setIsModalOpen(true);
  };

  const fixColDisplay = (columns) => {
    if (!!columns) {
      let tmpCols = [...columns];
      tmpCols[5] = {
        renderCell: (params) => {
          const [url, name] = [
            params.row.event_more_info_url,
            params.row.event_name,
          ];
          return (
            <a href={url} target="_blank" rel="noreferrer">
              {name}
            </a>
          );
        },
        ...tmpCols[5],
      };

      tmpCols[6] = {
        renderCell: (params) => {
          const reserved = params.row.is_reserved;
          return (
            <div className="d-flex justify-items-center align-content-center w-100">
              <MDBBtn
                className="p-2 d-flex"
                color={reserved ? "danger" : "primary"}
                onClick={() => {
                  handleOpenModal(params.row.id);
                }}
                data-testid="enrollCtlBtn"
              >
                {reserved ? "取消" : "預約"}
              </MDBBtn>
            </div>
          );
        },
        ...tmpCols[6],
      };
      setCols(tmpCols);
    }
  };

  const hendle_get_all_data = async () => {
    setIsLoadingData(true);
    await get_all_event()
      .then((res) => res.data)
      .then((data) => {

        setRows(data);
        enqueueSnackbar(<div data-testid="notiBox">資料更新成功</div>, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 1500,
        });
      })
      .catch((err) => {
        enqueueSnackbar(<div data-testid="notiBox">資料更新失敗</div>, {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
          autoHideDuration: 1500,
        });
      });
    // setRows(eventData);
    setIsLoadingData(false);
  };

  React.useEffect(async () => {
    closeSnackbar();
    fixColDisplay(columns);
    await hendle_get_all_data();
    return () => {
      closeSnackbar();
    };
  }, []);

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={Array.isArray(rows) ? rows : []}
          columns={cols}
          pageSize={5}
          disableSelectionOnClick
          className="bg-white"
          disableColumnMenu
          components={{
            Toolbar: GridToolbar,
          }}
          loading={isLoadingData}
          columnBuffer={8}
        />
        <EnrollModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modalPointedID={modalPointedID}
          rows={Array.isArray(rows) ? rows : []}
          hendle_get_all_data = {hendle_get_all_data}
        ></EnrollModal>
      </div>
    </>
  );
}

export default DataTable;
