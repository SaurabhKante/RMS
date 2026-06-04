import DashboardHeader from "../components/DashboardHeader";

const Dishes = () => {
  return (
    <>
      <DashboardHeader
        searchPlaceholder="Search Dishes"
        buttonText="New Dish"
        onSearch={(value) => console.log(value)}
        onButtonClick={() => console.log("Add Dish")}
      />

      <div>
        Dishes Content
      </div>
    </>
  );
};

export default Dishes;