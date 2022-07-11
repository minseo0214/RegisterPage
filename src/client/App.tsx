import React from 'react'
import './styles.css'

//CRUD (Create Read Update Delete)
export default function App() {
  // 회원 가입 페이지
  const register = () => {
    return '!!!'
    return (
      <div className="container">
        Welcome
        {/* username */}
        <div>
          username
          <input placeholder="Eneter username"></input>
        </div>
        {/* email */}
        <div>
          Email
          <input placeholder="Enter email"></input>
        </div>
        {/* password */}
        <div>
          Password
          <input placeholder="Enter password"></input>
        </div>
        {/* confirm password */}
        <div>
          Confirm Password
          <input placeholder="Enter password again"></input>
        </div>
      </div>
    )
  }

  return register()
}

// 회원가입

// 로그인

// 글 쓰기
