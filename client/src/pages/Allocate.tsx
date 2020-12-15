import React, { useState, useEffect } from "react";
import { DayOfWeek } from "../enums/DayOfWeek";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

const Allocate = (props: { [key: string]: any }) => {
  const [activities, setActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    let params: { [key: string]: any } = {
      ...props,
    };
    const getActivities = async () => {
      try {
        console.log(params.unitId);
        const res = await fetch(
          `http://localhost:8888/units/${params.unitId}/activities`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": "true",
            },
          }
        );
        return await res.json();
      } catch (e) {
        console.log("Error fetching user activities");
        return [];
      }
    };

    getActivities().then((res) => {
      setActivities(res);
    });
  }, [props]);

  const timeReducer = (time: String) =>
    time
      .split(":")
      .map((val) => parseInt(val))
      .reduce((val, total) => val * 60 + total);

  const sortDayTime = (list: IActivity[]) => {
    return list.sort((a, b) => {
      if (
        Object.values(DayOfWeek).indexOf(a.dayOfWeek) <
        Object.values(DayOfWeek).indexOf(b.dayOfWeek)
      ) {
        return -1;
      } else if (
        Object.values(DayOfWeek).indexOf(a.dayOfWeek) >
        Object.values(DayOfWeek).indexOf(b.dayOfWeek)
      ) {
        return 1;
      } else {
        return timeReducer(a.startTime) - timeReducer(b.startTime);
      }
    });
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table className={""} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Activity Code</TableCell>
              <TableCell align="right">Activity Group</TableCell>
              <TableCell align="right">Campus</TableCell>
              <TableCell align="right">Day of Week</TableCell>
              <TableCell align="right">Location </TableCell>
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Allocations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortDayTime(activities).map((activity, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {activity.activityCode}
                </TableCell>
                <TableCell align="right">{activity.activityGroup}</TableCell>
                <TableCell align="right">{activity.campus}</TableCell>
                <TableCell align="right">{activity.dayOfWeek}</TableCell>
                <TableCell align="right">{activity.location}</TableCell>
                <TableCell align="right">{activity.startTime}</TableCell>
                <TableCell align="right">{activity.duration}</TableCell>
                <TableCell align="right"> TO-DO </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Allocate;
