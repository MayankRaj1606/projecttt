import React from 'react'
import { NavLink } from 'react-router-dom'


const UserMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group">
                    <h4>User</h4>
                    <NavLink
                        to="/dashboard/user/profile"
                        className="list-group-item list-group-item-action"
                    >
                        Profile
                    </NavLink>
                    <NavLink
                        to="/dashboard/user/register-complaint"
                        className="list-group-item list-group-item-action"
                    >
                        Register Complaints
                    </NavLink>
                    <NavLink
                        to="/dashboard/user/complaints"
                        className="list-group-item list-group-item-action"
                    >
                        Complaints
                    </NavLink>

                </div>
            </div>
        </>
    )
}

export default UserMenu