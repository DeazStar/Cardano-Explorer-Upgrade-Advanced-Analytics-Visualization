import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TransactionChart = ({ transactionData, activeAccountsData }) => {
  return (
    <div>
      <h3 className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
        Transaction Count per Minute (Last Hour)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={transactionData}
          style={{ backgroundColor: '#3E4758', borderRadius: '8px' }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
          <XAxis dataKey="minute" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#3E4758' }} />
          <Line type="monotone" dataKey="transactionCount" stroke="#87CEEB" />
        </LineChart>
      </ResponsiveContainer>

      <h3 className="mx-8 mt-6 mb-4 font-bold text-2xl text-secondaryBg">
        Active Accounts per Epoch
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={activeAccountsData}
          style={{ backgroundColor: '#3E4758', borderRadius: '8px' }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
          <XAxis dataKey="epoch" stroke="#ffffff" />
          <YAxis stroke="#ffffff" tick={false} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#3E4758' }} />
          <Line type="monotone" dataKey="activeAccounts" stroke="#87CEEB" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
