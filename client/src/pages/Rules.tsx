import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@material-ui/core";
import DatabaseFinder from "../apis/DatabaseFinder";

const Rules = () => {
  const [rules, setRules] = useState<IRule[]>([]);

  const getRules = async () => {
    const res = await fetch("http://localhost:8888/rules");
    return res.json();
  };

  const postRules = async () => {
    try {
      DatabaseFinder.put("/rules", rules).then((res) => {
        setRules(res.data);
      });
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    getRules().then((res) => {
      // console.log(res);
      setRules(res);
    });
  }, []);

  return (
    <div id="main">
      <h1>Administration</h1>
      <div style={{ width: 800 }}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="global rules table">
            <TableHead>
              <TableRow>
                <TableCell>Rule</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules
                .sort((a, b) =>
                  a.ruleDescription.localeCompare(b.ruleDescription)
                )
                .map((rule, i) => (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row">
                      {rule.ruleDescription}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        label=""
                        type="number"
                        style={{ width: 60 }}
                        value={rule.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRules((rules) => {
                            let r = rules.slice();
                            let newValue = parseInt(e.target.value);
                            if (!isNaN(newValue)) r[i].value = newValue;
                            return r;
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ textAlign: "right" }}>
          <Button
            variant="contained"
            style={{ margin: "20px 0px 20px 20px" }}
            onClick={() => {
              getRules().then((res) => {
                setRules(res);
              });
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            style={{ margin: "20px 0px 20px 20px" }}
            color="primary"
            onClick={postRules}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rules;