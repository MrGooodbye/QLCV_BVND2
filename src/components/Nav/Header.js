import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink, useHistory } from "react-router-dom";
import { UserContext } from '../../context/UserContext';
import './SCSS/Nav.scss';
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { Box } from '@mui/material';
import NotifiIcon from './NotifiIcon';
//service
import signalRService from '../../services/signalRService.js';

const Header = (props) => {
  const { user, logoutContext } = useContext(UserContext);

  const location = useLocation();
  const history = useHistory();

  const [activeProposeDropDown, setActiveProposeDropDown] = useState(false);
  const [activeTaskDropDown, setActiveTaskDropDown] = useState(false);

  const handleTogglePropose = () => setActiveProposeDropDown(!activeProposeDropDown);
  const handleToggleTask = () => setActiveTaskDropDown(!activeTaskDropDown);

  const handleLogout = async () => {
    localStorage.removeItem('jwt'); //xóa localStorage
    logoutContext();
    // signalRService.removeFromGroup(user.account.userId);
    toast.success('Đăng xuất thành công!');
    history.push('/login-user');
  }

  if (user && user.isAuthenticated === true || location.pathname === '/') {
    return (
      <div className="nav-header">
        <Navbar expand="lg" className="bg-body-tertiary bg-header" style={{ padding: '0.5rem 5.5rem' }} >
          <Container fluid>
            <Navbar.Brand href="#home">
              {/* <img src={logo} width="50" height="25" className="d-inline-block align-top" alt="React Bootstrap logo" /> */}
              <span className="navbar-brand">BVND2</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>

                <NavLink exact to="/" className="nav-link">Trang chủ</NavLink>
                {user && user.isAuthenticated === true && user.account.departmentId === 'GD' ?
                  <>
                    <NavLink exact to="/list-doc" className="nav-link">Văn bản</NavLink>
                    {/* <NavLink exact to="/project-user" className="nav-link">Dự án</NavLink> */}
                  </>
                  :
                  <></>
                }

                {user && user.isAuthenticated === true && user.account.departmentId === 'HCQT' ?
                  <>
                    <NavLink to="/list-doc" className="nav-link">Văn bản</NavLink>
                  </>
                  :
                  <></>
                }

                {user && user.isAuthenticated === true ?
                  <>
                    <NavLink exact to="/list-propose-sent" className="nav-link">Đề xuất gửi</NavLink>
                  </>
                  :
                  <></>
                }

                {(() => {
                  if (user && user.isAuthenticated === true && user.account.userId === user.account.departmentHead && user.account.departmentType === 2) {
                    //hiện khi người login là trưởng phòng ở các phòng chức năng
                    return (
                      <>
                        <NavDropdown title="Đề xuất nhận" active={activeProposeDropDown} onToggle={handleTogglePropose}
                          className={location.pathname === '/list-propose-recive-out-department' || location.pathname === '/list-propose-recive-in-department' ? "nav-item-replace" : ""}>
                          <NavDropdown.Item as={NavLink} exact to="/list-propose-recive-out-department">Nhận từ phòng khoa</NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} exact to="/list-propose-recive-in-department">Nhận từ nhân viên</NavDropdown.Item>
                        </NavDropdown>
                      </>
                    )
                  }
                  else if (user && user.isAuthenticated === true && user.account.userId === user.account.departmentHead && user.account.departmentType === 3) {
                    //hiện khi người login là trưởng phòng ở các khoa bình thường
                    return (
                      <>
                        <NavLink exact to="/list-propose-recive-in-department" className="nav-link">Đề xuất nhận</NavLink>
                      </>
                    )
                  }
                  else {
                    //hiện khi người login là nhân viên ở các khoa bình thường lẫn các phòng chức năng
                    return (
                      null
                    )
                  }
                })()}

                {user && user.isAuthenticated === true && user.account.userId === user.account.departmentHead ?
                  <Box id="menu-dropdown-task">
                    <NavDropdown title="Công việc" active={activeTaskDropDown} onToggle={handleToggleTask}
                      className={location.pathname === '/task-out-department' || location.pathname === '/task-in-department' ? "nav-item-replace" : ""}>
                      <NavDropdown.Item as={NavLink} exact to="/task-out-department">Ngoại bộ</NavDropdown.Item>
                      <NavDropdown.Item as={NavLink} exact to="/task-in-department">Nội bộ</NavDropdown.Item>
                    </NavDropdown>
                  </Box>
                  :
                  null
                }

                {user && user.isAuthenticated === true ?
                  <>
                    <NavLink exact to="/my-to-do-list-schedule" className="nav-link">Công việc của tôi</NavLink>
                  </>
                  :
                  null
                }

                {user && user.isAuthenticated === true && user.account.userId === user.account.departmentHead ?
                  <NavLink exact to="/list-user" className="nav-link">Người dùng</NavLink>
                  :
                  null
                }

                {(() => {
                  if (user && user.isAuthenticated === true && user.account.departmentId === 'GD'
                    || user && user.isAuthenticated === true && user.account.departmentId === 'HCQT') {
                    return (
                      <></>
                    )
                  }
                  else if (user && user.isAuthenticated === false) {
                    return (
                      <></>
                    )
                  }
                  else if (user && user.isAuthenticated === true && user.account.userId === user.account.departmentHead) {
                    return (
                      <></>
                    )
                  }
                  else if (user && user.isAuthenticated === true && user.account.departmentName !== 'GD' && user.account.userId === user.account.departmentHead
                    || user && user.isAuthenticated === true && user.account.departmentName !== 'HCQT' && user.account.userId === user.account.departmentHead) {
                    return (
                      //hiện khi người login là trưởng phòng của các khoa
                      <>
                        <NavLink exact to="/list-doc-department" className="nav-link">Văn bản</NavLink>
                      </>
                    )
                  }
                  else {
                    return (
                      //ẩn khi người login là các thành viên trong khoa
                      <></>
                    )
                  }
                })()}
              </Nav>

              <Nav>
                {user && user.isAuthenticated === true ?
                  <><NotifiIcon /></>
                  :
                  null
                }
              </Nav>

              <Nav>
                {user && user.isAuthenticated === true ?
                  <>
                    <NavDropdown title={user.account.fullName} id="navbarScrollingDropdown">
                      <NavDropdown.Item href="">Đổi mật khẩu</NavDropdown.Item>
                      <NavDropdown.Item href="" onClick={() => handleLogout()}>Đăng xuất</NavDropdown.Item>
                    </NavDropdown>
                  </>
                  :
                  <>
                    <Nav>
                      <NavLink to="/login-user" className="nav-link">Đăng nhập</NavLink>
                    </Nav>
                  </>
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
  else {
    return <></>
  }
};
export default Header;