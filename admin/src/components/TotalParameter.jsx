import React from "react";
import Container from "./Container";
import { icons } from "../utils/icons";
import { Link } from "react-router-dom";

const TotalParameter = ({
  icon,
  title = "",
  value = 0,
  percent = 0,
  isIncrement = false,
  to = "",
}) => {
  return (
    <Link to={to}>
      <Container className="flex flex-col gap-2 hover:bg-slate-100">
        <div className="flex justify-center items-center gap-2 text-gray-500">
          <span>{icon}</span>
          <p className="text-sm font-bold">{title}</p>
        </div>
        <div className="flex justify-center items-center gap-4">
          <p className="text-3xl font-bold text-emerald-600">{value}</p>
          <div className="flex items-center gap-2 text-sm font-bold">
            {isIncrement ? (
              <span className="text-green-500">
                <icons.IoTrendingUpOutline size={18} />
              </span>
            ) : (
              <span className="text-red-500">
                <icons.IoTrendingDownOutline size={18} />
              </span>
            )}
            {isIncrement ? (
              <p className="text-green-500">{percent} %</p>
            ) : (
              <p className="text-red-500">{percent} %</p>
            )}
          </div>
        </div>
      </Container>
    </Link>
  );
};

export default TotalParameter;
