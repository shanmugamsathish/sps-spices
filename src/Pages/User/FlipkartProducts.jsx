import React from "react";
import TopSellingProducts from "../User/TopSellingProducts";
import theme from "../../lib/theme";
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../lib/constant';

function FlipkartProducts() {
  return (
    <div>
        <div className="flex justify-center items-center gap-4">
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-center flex items-center justify-center gap-2 ">
          <Zap
            className="text-white w-8 h-8 animate-pulse rounded-full p-1"
            style={{ backgroundColor: theme.colors.accent.primary }}
          />
          <div className="my-4 sm:my-6 lg:my-8">
            {/* Deal of the Day */}
            <span>Dail</span>
            <span
              style={{
                borderBottom: `4px solid ${theme.colors.accent.primary}`,
              }}
            >
              y D 
            </span>
            <span>eals</span>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
            <Link to={ROUTES.PRODUCTS} state={{ section: "flipkart-products" }}><button className="glow-button px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:opacity-90 transition-opacity relative z-10 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: theme.colors.accent.primary, color: theme.colors.background.main }} >  View All</button></Link>
        </div>
        </div>
      <TopSellingProducts marketplace="flipkart" />
    </div>
  );
}

export default FlipkartProducts;
