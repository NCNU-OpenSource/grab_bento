import React from "react";
import { HashRouter as Router, Link } from "react-router-dom";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownLink,
} from "mdb-react-ui-kit";
import { useAuth } from "../content/AuthContent";

function NavBar({ children }) {
  const { currentUser, logout } = useAuth();

  return (
    <div>
      <Router>
        <div className="h-100">
          <MDBNavbar expand="lg" dark bgColor="primary">
            <MDBContainer fluid>
              <Link to="/" className="text-white navbar-brand">
                Dashboard
              </Link>
              <MDBNavbarNav className="ml-auto" fullWidth={false} right>
                <MDBNavbarItem>
                  <MDBDropdown>
                    <MDBDropdownToggle tag="a" className="nav-link">
                      <MDBIcon icon="user" />
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem>
                        <MDBDropdownLink>
                          {!!currentUser ? currentUser.email : "無使用者"}
                        </MDBDropdownLink>
                      </MDBDropdownItem>
                      <MDBDropdownItem>
                        <MDBDropdownLink
                          onClick={() => {
                            logout();
                          }}
                        >
                          logout
                        </MDBDropdownLink>
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </MDBContainer>
          </MDBNavbar>
          <MDBContainer>{children}</MDBContainer>
        </div>
      </Router>
    </div>
  );
}

export default NavBar;
