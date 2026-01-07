import { type ParentComponent } from "solid-js";
import { DashboardLayout } from "~/components/layout/DashboardLayout";

const Dashboard: ParentComponent = (props) => {
  return <DashboardLayout>{props.children}</DashboardLayout>;
};

export default Dashboard;
