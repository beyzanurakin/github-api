import React, { createContext, useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = createContext()

//Provider Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  //request loading
  const [requests, setRequests] = useState(0)
  const [loading, setLoading] = useState(false)

  //error
  const [error, setError] = useState({ show: false, msg: '' })

  //check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data

        setRequests(remaining)
        if (remaining === 0) {
          toggleError(true, 'sorry you have exceded your hourly limit')
        }
      })
      .catch((err) => console.log(err))
  }

  function toggleError(show = false, msg = '') {
    setError({ show, msg })
  }
  const searchGithubUser = async (user) => {
    toggleError()
    setLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    )
    if (response) {
      setGithubUser(response.data)
      const { login, followers_url } = response.data

      // //repos
      // axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
      //   setRepos(response.data)
      // )
      // //followers
      // axios(`${followers_url}?per_page`).then((response) =>
      //   setFollowers(response.data)
      // )
      //wait for all the promises even if one of them get rejected return anyway
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page`),
      ])
        .then((results) => {
          const [repos, followers] = results
          const status = 'fulfilled'
          if (repos.status === status) {
            setRepos(repos.value.data)
          }
          if (followers.status === status) {
            setFollowers(followers.value.data)
          }
        })
        .catch((err) => console.log(err))
    } else {
      toggleError(true, 'there is no user with that user name')
    }
    checkRequests()
    setLoading(false)
  }
  //error
  useEffect(checkRequests, [])

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}
export { GithubProvider, GithubContext }
