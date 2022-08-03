import { useSelector } from "react-redux";
import noProject from "assets/images/profile/no-project.svg";
import emptyProject from "assets/images/profile/empty-project.svg";
import { Link, useParams } from "react-router-dom";

const EmptyCaseCard = (props) => {
  const userInfo = useSelector((state) => state.user.userinfo);
  const { id } = useParams();
  return (
    <div className="mt-[95px]">
      {userInfo.id && userInfo.id === id ? (
        <>
          <section className="text-center py-6">
            <img
              className="inline-block mb-4 md:mb-7"
              src={emptyProject}
              alt="This user haven’t create any Project."
            />
            <div className="text-color-ass-2 font-bold text-lg md:text-[26px]">
              You doesn't have any {props.type}.
              {props.type !== "External NFTs" && props.type !== "Bookmark" && (
                <>
                  <br /> let’s go create {props.type}!
                </>
              )}
            </div>
            {props.type !== "External NFTs" && props.type !== "Bookmark" && (
              <button
                type="button"
                className="btn-outline-primary-gradient btn-md mt-5"
              >
                <Link
                  to={
                    props.type === "Project"
                      ? "/project-create"
                      : "/undefined/mint-nft"
                  }
                >
                  <span>
                    Create New <i className="fa-thin fa-square-plus ml-2"></i>
                  </span>
                </Link>
              </button>
            )}
          </section>
        </>
      ) : (
        <>
          <section className="text-center py-6">
            <img
              className="inline-block mb-4 md:mb-7"
              src={noProject}
              alt="This user haven’t create any Project."
            />
            <div className="text-color-ass-2 font-bold text-lg md:text-[26px]">
              This user haven’t create any {props.type}.
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default EmptyCaseCard;
