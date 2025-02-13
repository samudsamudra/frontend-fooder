interface RevenueCardProps {
  title: string;
  value: number | string;
  chart: React.ReactNode;
}

const RevenueCard: React.FC<RevenueCardProps> = ({ title, value, chart }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <p className="text-2xl font-bold mb-4">{value}</p>
    {chart}
  </div>
);

export default RevenueCard;
