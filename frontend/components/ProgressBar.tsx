type ProgressProps = {
  current: number;
  end: number;
};

const ProgressBar: React.FC<ProgressProps> = ({ ...props }) => {
  const { current, end } = props;
  const progress = end > 0 ? (current / end) * 100 : 0;
  const progressInt = progress.toFixed(0);
  console.log({ current, end, progressInt });
  return (
    <div className="w-full bg-gray-200 h-3 rounded-lg">
      <div
        className="bg-gradient-to-r from-cyan-500 to-green-500 h-3 rounded-lg"
        style={{ width: `${progressInt}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
