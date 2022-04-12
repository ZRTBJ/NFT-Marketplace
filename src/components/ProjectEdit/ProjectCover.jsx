const ProjectCover = () => {
  return (
    <div>
      <div>
        <img
          src={require(`assets/images/projectEdit/ff-xv.jpg`)}
          alt="cover"
          style={{ width: "100%", height: 400 }}
        />
      </div>
      <div
        className="relative bottom-16 w-full h-16"
        style={{ backgroundColor: `rgb(0, 0, 0, 0.6)` }}
      >
        <div className="text-center">
          <span className="relative bottom-4 inline-flex items-center justify-center px-3.5 py-1.5 text-lg text-white font-bold leading-none bg-[#0AB4AF] rounded-full">
            PROJECT PAGE
          </span>
        </div>
        <div className="text-center text-white text-lg">
          FINAL FANTASY XVI “AWAKENING”
        </div>
      </div>
    </div>
  );
};
export default ProjectCover;
