import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const CircularProgressWithLabel = (props) => {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary" fontSize={13.5}>
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
};

export default function CircularWithValueLabel(props) {
    const [progress, setProgress] = React.useState();

    React.useEffect(() => {
        setProgress(props.progressValue)
    })

    return <CircularProgressWithLabel value={progress} />;
}
