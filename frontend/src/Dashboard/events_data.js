let data = [
  {
    id: 0,
    event_name: "test1",
    event_time: "2021-06-30 13:00",
    event_duration: 2,
    start_resrevation_date: "2021-06-30 13:00",
    end_reservation_date: "2021-06-30 13:00",
    event_more_info_url:
      "https://ccweb.ncnu.edu.tw/SLLL/z958B653E5831540D4E4B6D3B52D5660E7D30view.asp?showdetail=&RowID=3009",
    is_reserved: false,
    event_place: "學活八角廳",
    quota_and_reserve_and_enroll: "20/10/10",
    tags: ["便當", "專題講座"],
  },
  {
    id: 1,
    event_name: "serious_lecture",
    event_time: "2021-06-30 13:00",
    event_duration: 2,
    start_resrevation_date: "2021-06-30 13:00",
    end_reservation_date: "2021-06-30 13:00",
    event_more_info_url:
      "https://ccweb.ncnu.edu.tw/SLLL/z958B653E5831540D4E4B6D3B52D5660E7D30view.asp?showdetail=&RowID=3009",
    is_reserved: true,
    event_place: "學活八角廳",
    quota_and_reserve_and_enroll: "20/10/10",
    tags: ["專題講座"],
  },
];

let headCells = [
  {
    field: "event_name",
    numeric: true,
    disablePadding: false,
    headerName: "活動名稱",
    width: 150,
  },
  {
    field: "event_time",
    numeric: true,
    disablePadding: false,
    headerName: "活動開始時間",
    width: 150,
  },
  {
    field: "event_duration",
    numeric: true,
    disablePadding: false,
    headerName: "時長",
    width: 120,
  },
  {
    field: "end_reservation_date",
    numeric: true,
    disablePadding: false,
    headerName: "結束預約日期",
    width: 150,
  },
  {
    field: "event_place",
    numeric: true,
    disablePadding: false,
    headerName: "地點",
    width: 150,
  },
  {
    field: "event_more_info_url",
    numeric: true,
    disablePadding: false,
    headerName: "更多資訊",
    width: 150,
  },
  {
    field: "is_reserved",
    numeric: true,
    disablePadding: false,
    headerName: "是否預約",
    width: 150,
  },
  {
    field: "tags",
    numeric: true,
    disablePadding: false,
    headerName: "標籤",
    width: 150,
    renderCell: (params) =>
      Array.isArray(params.row.tags)
        ? params.row.tags.map((tag, idx) => (
            <span className="badge bg-dark m-1" key={idx}>
              {tag}
            </span>
          ))
        : <span></span>,
  },
];

export { data, headCells };
