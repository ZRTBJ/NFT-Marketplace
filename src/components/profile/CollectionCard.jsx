const CollectionCard = ({ cardInfo }) => {
  return (
    <div className="collectionCardContainer">
      <div className="collectionCardInnerContainer">
        <div className="collectionCardCircleSvg"></div>
        <div className="collectionCardImageContainer">
          <div className="collectionCardRadialContainer">
            <img src={cardInfo.img} alt="" />
          </div>
        </div>

        <div className="collectionCardTitle">{cardInfo.title}</div>
      </div>
    </div>
  );
};
export default CollectionCard;
