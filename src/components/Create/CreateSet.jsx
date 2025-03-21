import "./create.css";
import {Link} from "react-router-dom";

const CreateSetLabel = () => {
    return (
        <>
            <div className="label-create">
                <div>
                    <img src="src/assets/images/3d_flashcard.png" alt=""/>
                    <b className="label-text">Create your flashcard sets to continue learning effectively!</b>
                </div>
                <Link to="create">
                    <button className="create-button">
                        Create
                    </button>
                </Link>
            </div>
        </>
    )
}
export default CreateSetLabel;
