import { useState } from "react";
import { Package, FileText, Check } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const PaymentOptions = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();

  const handleSelectPackage = () => {
    setSelectedOption("package");
    navigate("/select-package", { 
      state: { 
        paymentType: "package",
        hasFullAccess: true
      } 
    });
    console.log("Selected package option");
  };

  const handleSelectPaper = () => {
    setSelectedOption("paper");
    navigate("/select-attempts", { 
      state: { 
        paymentType: "paper",
        hasFullAccess: false,
        //educationLevel: userInfo.educationLevel
      } 
    });
    console.log("Selected paper option");
  };

  const cardStyle = {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%'
  };

  const hoveredCardStyle = {
    ...cardStyle,
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        {/* Enhanced Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark mb-3">Choose Your Payment Plan</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Select the payment plan that best fits your exam preparation needs
          </p>
        </div>
        
        <div className="row justify-content-center g-4">
          {/* Enhanced Pay per Package Card */}
          <div className="col-md-5">
            <div 
              className={`card border-0 shadow-sm ${selectedOption === "package" ? "border-primary border-3" : ""}`}
              style={hoveredCard === "package" ? hoveredCardStyle : cardStyle}
              onMouseEnter={() => setHoveredCard("package")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-body text-center d-flex flex-column p-4">
                {/* Popular Badge */}
                <div className="position-relative">
                  <span className="badge bg-primary position-absolute top-0 start-50 translate-middle px-3 py-2 rounded-pill">
                    Most Popular
                  </span>
                </div>
                
                {/* Icon with enhanced styling */}
                <div className="mx-auto mb-4 mt-3 rounded-circle d-flex align-items-center justify-content-center" 
                      style={{ 
                        width: '80px', 
                        height: '80px',
                        background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                        color: 'white'
                      }}>
                  <Package size={36} />
                </div>
                
                <h2 className="card-title fw-bold mb-2 text-primary">Package Subscription</h2>
                <p className="text-muted mb-4">Get unlimited access with our comprehensive packages</p>
                
                {/* Enhanced Benefits List */}
                <div className="text-start mb-4 flex-grow-1">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '24px', height: '24px', minWidth: '24px' }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="fw-medium">Access all exam papers for any subject</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '24px', height: '24px', minWidth: '24px' }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="fw-medium">Unlimited attempts during subscription period</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" 
                      style={{ width: '24px', height: '24px', minWidth: '24px' }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="fw-medium">Full access for subscription period</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '24px', height: '24px', minWidth: '24px' }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="fw-medium">Best value for comprehensive study</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleSelectPackage}
                  className="btn btn-primary btn-lg fw-semibold py-3 mt-auto"
                  style={{ 
                    borderRadius: '12px',
                    background: selectedOption === "package" ? 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' : undefined,
                    border: 'none',
                    boxShadow: selectedOption === "package" ? '0 4px 12px rgba(13, 110, 253, 0.4)' : undefined
                  }}
                >
                  Choose a Package
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Pay per Paper Card */}
          <div className="col-md-5">
            <div 
              className={`card border-0 shadow-sm ${selectedOption === "paper" ? "border-success border-3" : ""}`}
              style={hoveredCard === "paper" ? hoveredCardStyle : cardStyle}
              onMouseEnter={() => setHoveredCard("paper")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-body text-center d-flex flex-column p-4">
                {/* Flexible Badge */}
                <div className="position-relative">
                  <span className="badge bg-success position-absolute top-0 start-50 translate-middle px-3 py-2 rounded-pill">
                    Flexible
                  </span>
                </div>
                
                {/* Icon with enhanced styling */}
                <div className="mx-auto mb-4 mt-3 rounded-circle d-flex align-items-center justify-content-center" 
                      style={{ 
                        width: '80px', 
                        height: '80px',
                        background: 'linear-gradient(135deg, #198754 0%, #146c43 100%)',
                        color: 'white'
                      }}>
                  <FileText size={36} />
                </div>
                
                <h2 className="card-title fw-bold mb-2 text-success">Pay per Attempt</h2>
                <p className="text-muted mb-4">Pay only for the attempts you need</p>
                
                {/* Enhanced Benefits List */}
                <div className="text-start mb-4 flex-grow-1">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '24px', height: '24px', minWidth: '24px' }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="fw-medium">Access any exam paper of your choice</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '24px', height: '24px', minWidth: '24px' }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="fw-medium">Choose your number of attempts</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '24px', height: '24px', minWidth: '24px' }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="fw-medium">Pay only for what you use</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3" 
                          style={{ width: '24px', height: '24px', minWidth: '24px' }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="fw-medium">Perfect for targeted study</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleSelectPaper}
                  className="btn btn-success btn-lg fw-semibold py-3 mt-auto"
                  style={{ 
                    borderRadius: '12px',
                    background: selectedOption === "paper" ? 'linear-gradient(135deg, #198754 0%, #146c43 100%)' : undefined,
                    border: 'none',
                    boxShadow: selectedOption === "paper" ? '0 4px 12px rgba(25, 135, 84, 0.4)' : undefined
                  }}
                >
                  Pay per Paper
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            <div className="card border-0 bg-white shadow-sm">
              <div className="card-body text-center p-4">
                <h5 className="fw-bold mb-3">Need Help Choosing?</h5>
                <p className="text-muted mb-0">
                  If you plan to practice multiple subjects or take several exams, the package subscription offers better value. 
                  For single subject preparation or occasional practice, pay-per-attempt is more economical.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;