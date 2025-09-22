import React, {useState, useEffect, useContext, Suspense, lazy} from "react";
import "./Project.scss";
import Button from "../../components/button/Button";
import {openSource, socialMediaLinks} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import Loading from "../../containers/loading/Loading";

function getRandomItems(arr, max = 10) {
  const shuffled = arr.sort(() => 0.5 - Math.random()); // Fisher-Yates alternative
  return shuffled.slice(0, Math.min(max, arr.length));
}
export default function Projects() {
  const GithubRepoCard = lazy(() =>
    import("../../components/githubRepoCard/GithubRepoCard")
  );
  const FailedLoading = () => null;
  const renderLoader = () => <Loading />;
  const [repo, setrepo] = useState([]);
  // todo: remove useContex because is not supported
  const {isDark} = useContext(StyleContext);

  function setrepoFunction(array) {
    setrepo(array);
  }

  useEffect(() => {
    const getRepoData = () => {
      fetch("https://api.github.com/users/bijaybohora/repos")
        .then(result => {
          if (result.ok) {
            return result.json();
          }
          throw result;
        })
        .then(response => {
          setrepoFunction(response);
        })
        .catch(function (error) {
          console.error(
            `${error} (because of this error, nothing is shown in place of Projects section. Also check if Projects section has been configured)`
          );
          setrepoFunction("Error");
        });
    };
    getRepoData();
  }, []);

  if (
    // !(typeof repo === "string" || repo instanceof String) &&
    openSource.display
  ) {
    return (
      <Suspense fallback={renderLoader()}>
        <div className="main" id="opensource">
          <h1 className="project-title">Github Projects(Public)</h1>
          {repo.length > 0 && (
            <div className="repo-cards-div-main">
              {getRandomItems(repo)?.map((v, i) => {
                if (!v) {
                  console.error(
                    `Github Object for repository number : ${i} is undefined`
                  );
                }
                return <GithubRepoCard repo={v} key={v.id} isDark={isDark} />;
              })}
            </div>
          )}

          <Button
            text={"More Projects"}
            className="project-button"
            href={socialMediaLinks.github}
            newTab={true}
          />
        </div>
      </Suspense>
    );
  } else {
    return <FailedLoading />;
  }
}
