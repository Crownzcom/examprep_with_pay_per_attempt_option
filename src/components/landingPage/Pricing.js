import React from "react";
import moment from "moment-timezone";
import "./Pricing.css";

// Mock implementation of calculateDaysLeft (replace with your actual function)
const calculateDaysLeft = (expiryDate) => {
  const now = moment();
  const endDate = moment(expiryDate);
  return endDate.diff(now, "days");
};

const packages = {
  PLE: [
    {
      tier: "PLE Starter Pack",
      points: 1000,
      price: 20000,
      staticDate: false,
      duration: 30,
      expiryDate: moment().tz("Africa/Nairobi").add(30, "days").toDate(),
      features: ["Valid for 30 days"],
    },
    {
      tier: "PLE Limited Pack",
      points: 1000,
      price: 70000,
      staticDate: true,
      duration: calculateDaysLeft("2024-12-31T23:59:59.999+03:00"),
      expiryDate: moment("2024-12-31T23:59:59.999+03:00").toISOString(),
      features: ["Valid until 31st December, 2024"],
    },
    {
      tier: "PLE Annual Pack",
      points: 10000,
      price: 100000,
      staticDate: false,
      duration: 366,
      expiryDate: moment().tz("Africa/Nairobi").add(366, "days").toDate(),
      features: ["Valid for a year - 366 Days"],
    },
  ],
  UCE: [
    {
      tier: "UCE Starter Pack",
      points: 2000,
      price: 30000,
      staticDate: false,
      duration: 45,
      expiryDate: moment().tz("Africa/Nairobi").add(45, "days").toDate(),
      features: ["Valid for 45 days"],
    },
    {
      tier: "UCE Premium Pack",
      points: 5000,
      price: 80000,
      staticDate: true,
      duration: calculateDaysLeft("2024-12-31T23:59:59.999+03:00"),
      expiryDate: moment("2024-12-31T23:59:59.999+03:00").toISOString(),
      features: ["Valid until 31st December, 2024"],
    },
    {
      tier: "UCE Ultimate Pack",
      points: 15000,
      price: 120000,
      staticDate: false,
      duration: 366,
      expiryDate: moment().tz("Africa/Nairobi").add(366, "days").toDate(),
      features: ["Valid for a year - 366 Days"],
    },
  ],
};

const Pricing = () => {
  return (
    <section className="pricing">
      <img
        className="pricing-background"
        src="./img/background-3.png"
        alt="background-3"
      />
      <div className="container">
        <div className="row gap-3 Pricing-main-title">
          <div className="col-12">
            <div className="section-heading pb-55 text-center">
              <h2>Subscription Plan</h2>
              <p className="edu-main-intro">
                Subscribe now to regain access to all exams and continue
                enhancing your skills
              </p>
            </div>
          </div>
        </div>
        {/* Map over the packages */}
        {Object.entries(packages).map(([level, plans]) => (
          <div key={level} className="row gap-3">
            <div className="col-12 text-center">
              <h3>{level} Packages</h3>
            </div>
            {plans.map((plan, index) => (
              <div className="col-lg-4 col-md-6 bg-white" key={index}>
                <div className="pricing-single white-bg text-center mb-30">
                  <div className="price-title uppercase">
                    <h4>{plan.tier}</h4>
                    <div className="pricing-price">
                      <span>UGX {plan.price.toLocaleString()}</span>
                    </div>
                    <div className="pricing-features">
                      <ul>
                        {plan.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="order-btn">
                      <a href="#">Subscribe Now</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
