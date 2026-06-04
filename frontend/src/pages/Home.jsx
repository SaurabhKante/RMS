import DashboardHeader from "../components/DashboardHeader";

const Home = () => {
  return (
    <>
      <DashboardHeader
        searchPlaceholder="Search tables"
        buttonText="New Table"
        onSearch={(value) => console.log(value)}
        onButtonClick={() => console.log("Create Table")}
      />

      <div>
        Home Content
      </div>
    </>
  );
};

export default Home;