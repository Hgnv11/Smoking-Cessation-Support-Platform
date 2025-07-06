import "./progress.css";

function UserProgress() {
  return (
    <>
      <div className="progress">
        <div className="progress__content">
          <div className="progress__content-inner">
            <p className="progress__content-inner-title">
              You have Quit Smoking for
            </p>
            <div className="progress__content-inner-circle">
              <p className="progress__content-inner-circle-day-num">13</p>
              <p className="progress__content-inner-circle-day-text">DAY(S)</p>
            </div>
          </div>
          <div className="progress__content-overall">
            <p className="progress__content-overall-title">Overall Progress</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProgress;
