import React from 'react';

const StarRating = ({ rating }: any) => {
    const maxStars = 5;
    // Function to convert the rating to a scale of 0 to 5
    const getStarRating = (rating: any) => {
        const maxRating = 100;
        const starPercentage = (rating / maxRating) * 100;
        const roundedStars = Math.round(starPercentage / 20); // Divide by 20 to get the scale of 0 to 5
        return roundedStars;
    };

    // Function to generate star elements based on the rating
    const renderStars = () => {
        const starRating = getStarRating(rating);
        const stars = [];
        for (let i = 0; i < maxStars; i++) {
            if (i < starRating) {
                if (i === starRating - 1 && starRating % 1 !== 0) {
                    // Render half-filled star for last star
                    stars.push(<i key={i} className="fa fa-star-half-o"></i>);
                } else {
                    // Render full star
                    stars.push(<i key={i} className="fa fa-star"></i>);
                }
            } else {
                // Render empty star
                stars.push(<i key={i} className="fa fa-star-o"></i>);
            }
        }
        return stars;
    };

    return (
        <div>
            {renderStars()}
        </div>
    );
};

export default StarRating;
