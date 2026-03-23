const RecipientCard = ({ recipient }) => {
  if (!recipient) {
    return null;
  }

  const fallbackAvatar = "https://placehold.co/64x64?text=DS";

  return (
    <div className="card recipient-card">
      <div className="recipient-card__avatar">
        <img
          src={recipient.profilePicture || fallbackAvatar}
          alt={recipient.fullName}
          onError={(event) => {
            event.currentTarget.src = fallbackAvatar;
          }}
        />
      </div>
      <div>
        <p className="recipient-card__label">Recipient verified</p>
        <h3 className="recipient-card__name">{recipient.fullName}</h3>
      </div>
    </div>
  );
};

export default RecipientCard;
