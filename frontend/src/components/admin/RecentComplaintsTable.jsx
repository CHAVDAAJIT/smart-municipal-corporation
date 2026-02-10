function RecentComplaintsTable() {
  return (
    <div className="recent-complaints">
      <h3>Recent Complaints</h3>

      <table>
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Citizen</th>
            <th>Category</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>#CMP101</td>
            <td>Rahul Patel</td>
            <td>Garbage</td>
            <td className="status pending">Pending</td>
            <td>12 Aug 2026</td>
          </tr>

          <tr>
            <td>#CMP102</td>
            <td>Amit Shah</td>
            <td>Water</td>
            <td className="status resolved">Resolved</td>
            <td>11 Aug 2026</td>
          </tr>

          <tr>
            <td>#CMP103</td>
            <td>Neha Mehta</td>
            <td>Street Light</td>
            <td className="status pending">Pending</td>
            <td>10 Aug 2026</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RecentComplaintsTable;
