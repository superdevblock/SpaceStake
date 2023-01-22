import { useEffect, useState } from "react";
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useSelector } from "react-redux";
import Chart from "../../components/Chart/Chart.jsx";
import { trim, formatCurrency } from "../../helpers";
import {
  treasuryDataQuery,
  rebasesDataQuery,
  bulletpoints,
  tooltipItems,
  tooltipInfoMessages,
  itemType,
} from "./treasuryData.js";
import { useTheme } from "@material-ui/core/styles";
import "./treasury-dashboard.scss";
import apollo from "../../lib/apolloClient";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip.jsx";

function TreasuryDashboard() {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  const [staked, setStaked] = useState(null);
  const theme = useTheme();
  const smallerScreen = useMediaQuery("(max-width: 650px)");
  const verySmallScreen = useMediaQuery("(max-width: 379px)");

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });

  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const backingPerOhm = useSelector(state => {
    return state.app.treasuryMarketValue / state.app.circSupply;
  });

  const wsOhmPrice = useSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  useEffect(() => {
    apollo(treasuryDataQuery).then(r => {
      let metrics = r.data.protocolMetrics.map(entry =>
        Object.entries(entry).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
      );
      metrics = metrics.filter(pm => pm.treasuryMarketValue > 0);
      setData(metrics);

      let staked = r.data.protocolMetrics.map(entry => ({
        staked: (parseFloat(entry.sOhmCirculatingSupply) / parseFloat(entry.ohmCirculatingSupply)) * 100,
        timestamp: entry.timestamp,
      }));
      staked = staked.filter(pm => pm.staked < 100);
      setStaked(staked);

      let runway = metrics.filter(pm => pm.runway10k > 5);
      setRunway(runway);
    });

    apollo(rebasesDataQuery).then(r => {
      let apy = r.data.rebases.map(entry => ({
        apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
        timestamp: entry.timestamp,
      }));

      apy = apy.filter(pm => pm.apy < 300000);

      setApy(apy);
    });
  }, []);

  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >
        <div id="dash" className="tab-pane fade in active">
          <div className="main-block">
            <div className="box">
              <div className="item">
                <h4>GYRO Price</h4>
                <h2>{marketPrice ? formatCurrency(marketPrice, 2) : <Skeleton type="text" />}</h2>
              </div>
              <div className="item">
                <h4>APY</h4>
                <h2>{apy ? `${trim(apy[0].apy, 2)}%` : <Skeleton type="text" />}</h2>
              </div>
            </div>
            <div className="box">
              <div className="item">
                <h4>TVL</h4>
                <h5>{data ? formatCurrency(data[0].totalValueLocked) : <Skeleton type="text" />}</h5>
              </div>
              <div className="item">
                <h4>GYRO Staked</h4>
                <h5>{staked ? `${trim(staked[0].staked, 2)} %` : <Skeleton type="text" />}</h5>
              </div>
            </div>
            <div className="box">
              <div className="item">
                <h4>Market Cap</h4>
                <h5>{marketCap ? formatCurrency(marketCap, 0) : <Skeleton type="text" />}</h5>
              </div>
              <div className="item">
                <h4>Circulating Supply</h4>
                <h5>
                  {circSupply && totalSupply ? (
                    parseInt(circSupply) + " / " + parseInt(totalSupply)
                  ) : (
                    <Skeleton type="text" />
                  )}
                </h5>
              </div>
            </div>
            <div className="box">
              <div className="item">
                <h4>Runway</h4>
                <h5>{data ? `${trim(data[0].runwayCurrent, 1)} Days` : <Skeleton type="text" />}</h5>
              </div>
            </div>
          </div>
          <div className="wallet-block">
            <h2>Wallet Balance</h2>
            <div className="box">
              <div className="item">
                <span className="img_icon">
                  <img src="images/tap-logo.png" alt="" />
                </span>
                <h4>GYRO Price</h4>
                <span className="plus_icon">
                  <i className="fas fa-plus-circle" />
                </span>
              </div>
              <div className="item">
                <h4>0.0000</h4>
              </div>
            </div>
            <div className="box">
              <div className="item">
                <span className="img_icon">
                  <img src="images/tap-logo.png" alt="" />
                </span>
                <h4>GYRO Price</h4>
                <span className="plus_icon">
                  <i className="fas fa-plus-circle" />
                </span>
              </div>
              <div className="item">
                <h4>0.0000</h4>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
