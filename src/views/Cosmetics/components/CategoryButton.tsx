import { Button } from "@components/index";
import React from "react";

interface CategoryButtonProps {
  title: string;
  selectedState: (title: string) => void;
  getSelected: string;
  fw: number;
  icon?: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ title, selectedState, getSelected, fw, icon }: CategoryButtonProps) => {
  return (
    <Button onClick={() => {
        selectedState(title);
    }} style={{
      position: "absolute",
      left: ((fw - 1) * 120) + "px",

      backgroundColor: getSelected === title ? "#fff" : "transparent",
      color: getSelected === title ? "#000" : "#fff",

      minHeight: "60px",
      transform: "translateY(11px)",

      transition: "color 0.3s, background-color 0.3s"
    }}><i className={icon} style={{marginRight: "10px"}} /> {title}</Button>
  );
};

export default CategoryButton;
