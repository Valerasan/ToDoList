import CircularProgress from '@mui/joy/CircularProgress';

function LoadingScreen() {
    return <div className="loading-icon"><CircularProgress
        color="neutral"
        determinate={false}
        size="lg"
        value={25}
        variant="solid"
    />
    </div>
}

export default LoadingScreen;