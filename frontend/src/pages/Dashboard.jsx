import {
  useEffect,
  useState
} from "react";

import api from "../api/axios";

import MainLayout from "../layouts/MainLayout";

import StatsCard from "../components/StatsCard";

function Dashboard() {

  const [stats, setStats] =
    useState({
      total: 0,
      done: 0,
      in_progress: 0,
      incomplete: 0,
      overdue: 0
    });

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats =
    async () => {

      try {

        const response =
          await api.get(
            "/dashboard/stats"
          );

        setStats(
          response.data
        );

      } catch (err) {

        console.log(err);
      }
    };

  return (

    <MainLayout>

      <h1
        className="
        text-4xl
        font-bold
        mb-8
        "
      >
        Dashboard
      </h1>

      <div
        className="
        grid
        grid-cols-5
        gap-4
        "
      >

        <StatsCard
          title="Total Tasks"
          value={stats.total}
        />

        <StatsCard
          title="Done"
          value={stats.done}
        />

        <StatsCard
          title="In Progress"
          value={stats.in_progress}
        />

        <StatsCard
          title="Incomplete"
          value={stats.incomplete}
        />

        <StatsCard
          title="Overdue"
          value={stats.overdue}
        />

      </div>

    </MainLayout>

  );
}

export default Dashboard;