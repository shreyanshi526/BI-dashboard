import { TransactionRepository } from '../transaction/transaction.repository';
import { UserRepository } from '../user/user.repository';
import {
  DashboardSummary,
  CostByModel,
  UsageByRegion,
  DailyTrend,
  MonthlyTrend,
  UsageByDepartment,
  TokenDistribution,
  TopUser,
  UsageByCompany,
  DateRange,
  DashboardQueryParams,
} from './dashboard.model';

export class DashboardService {
  private transactionRepository: TransactionRepository;
  private userRepository: UserRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.userRepository = new UserRepository();
  }

  async getSummary(params: DashboardQueryParams = {}): Promise<DashboardSummary> {
    const transactionQuery = {
      startDate: params.startDate,
      endDate: params.endDate,
      region: params.region,
    };

    const transactions = await this.transactionRepository.findAll(transactionQuery);
    
    const totalTransactions = transactions.length;
    const totalTokens = transactions.reduce((sum, t) => sum + t.tokenCount, 0);
    const totalCost = transactions.reduce((sum, t) => sum + t.calculatedCost, 0);
    
    const uniqueUserIds = new Set(transactions.map(t => t.userId));
    const activeUsers = uniqueUserIds.size;
    
    const uniqueConversations = new Set(transactions.map(t => t.conversationId));
    const totalConversations = uniqueConversations.size;
    
    const userQuery = params.region && params.region !== 'all' 
      ? { region: params.region } 
      : {};
    const totalUsers = await this.userRepository.count(userQuery);
    const proUsers = await this.userRepository.count({ ...userQuery, isActiveSub: true });

    return {
      totalTransactions,
      totalTokens,
      totalCost: parseFloat(totalCost.toFixed(2)),
      activeUsers,
      totalUsers,
      proUsers,
      totalConversations,
      avgCostPerConversation: totalConversations > 0 
        ? parseFloat((totalCost / totalConversations).toFixed(4)) 
        : 0,
    };
  }

  async getCostByModel(params: DashboardQueryParams = {}): Promise<CostByModel[]> {
    const aggregation = await this.transactionRepository.aggregateByModel({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    return aggregation.map((item: any) => ({
      model: item._id,
      cost: parseFloat(item.cost.toFixed(2)),
      tokens: item.tokens,
      transactions: item.transactions,
    }));
  }

  async getUsageByRegion(params: DashboardQueryParams = {}): Promise<UsageByRegion[]> {
    const transactions = await this.transactionRepository.findAll({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    const userIds = [...new Set(transactions.map(t => t.userId))];
    const users = await Promise.all(
      userIds.map(id => this.userRepository.findByUserId(id))
    );
    const userMap = new Map(users.filter(u => u).map(u => [u!.userId, u!]));

    // Group by region
    const regionMap = new Map<string, {
      cost: number;
      tokens: number;
      userIds: Set<string>;
      transactions: number;
    }>();

    transactions.forEach(transaction => {
      const user = userMap.get(transaction.userId);
      if (!user) return;

      const region = user.region;
      if (!regionMap.has(region)) {
        regionMap.set(region, {
          cost: 0,
          tokens: 0,
          userIds: new Set(),
          transactions: 0,
        });
      }

      const regionData = regionMap.get(region)!;
      regionData.cost += transaction.calculatedCost;
      regionData.tokens += transaction.tokenCount;
      regionData.userIds.add(transaction.userId);
      regionData.transactions += 1;
    });

    return Array.from(regionMap.entries()).map(([region, data]) => ({
      region,
      cost: parseFloat(data.cost.toFixed(2)),
      tokens: data.tokens,
      users: data.userIds.size,
      transactions: data.transactions,
    })).sort((a, b) => b.cost - a.cost);
  }

  async getDailyTrends(params: DashboardQueryParams = {}): Promise<DailyTrend[]> {
    const transactions = await this.transactionRepository.findAll({
      startDate: params.startDate,
      endDate: params.endDate,
      region: params.region,
    });

    if (!transactions || transactions.length === 0) {
      return [];
    }
    const dateMap = new Map<string, {
      cost: number;
      tokens: number;
      userIds: Set<string>;
      transactions: number;
    }>();

    transactions.forEach(transaction => {
      if (!transaction.timestamp) {
        return;
      }

      try {
        const date = new Date(transaction.timestamp).toISOString().split('T')[0];
        if (!date || date === 'Invalid Date') {
          return;
        }

        if (!dateMap.has(date)) {
          dateMap.set(date, {
            cost: 0,
            tokens: 0,
            userIds: new Set(),
            transactions: 0,
          });
        }

        const dateData = dateMap.get(date)!;
        dateData.cost += transaction.calculatedCost || 0;
        dateData.tokens += transaction.tokenCount || 0;
        if (transaction.userId) {
          dateData.userIds.add(transaction.userId);
        }
        dateData.transactions += 1;
      } catch (error) {
        console.warn('Invalid transaction timestamp:', transaction.timestamp);
      }
    });

    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        cost: parseFloat(data.cost.toFixed(2)),
        tokens: data.tokens,
        users: data.userIds.size,
        transactions: data.transactions,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getMonthlyTrends(params: DashboardQueryParams = {}): Promise<MonthlyTrend[]> {
    const transactions = await this.transactionRepository.findAll({
      startDate: params.startDate,
      endDate: params.endDate,
      region: params.region,
    });

    // Group by month
    const monthMap = new Map<string, {
      cost: number;
      tokens: number;
      userIds: Set<string>;
      transactions: number;
    }>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.timestamp);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthMap.has(month)) {
        monthMap.set(month, {
          cost: 0,
          tokens: 0,
          userIds: new Set(),
          transactions: 0,
        });
      }

      const monthData = monthMap.get(month)!;
      monthData.cost += transaction.calculatedCost;
      monthData.tokens += transaction.tokenCount;
      monthData.userIds.add(transaction.userId);
      monthData.transactions += 1;
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        cost: parseFloat(data.cost.toFixed(2)),
        tokens: data.tokens,
        users: data.userIds.size,
        transactions: data.transactions,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  async getUsageByDepartment(params: DashboardQueryParams = {}): Promise<UsageByDepartment[]> {
    const transactions = await this.transactionRepository.findAll({
      startDate: params.startDate,
      endDate: params.endDate,
      region: params.region,
    });

    const userIds = [...new Set(transactions.map(t => t.userId))];
    const users = await Promise.all(
      userIds.map(id => this.userRepository.findByUserId(id))
    );
    const userMap = new Map(users.filter(u => u).map(u => [u!.userId, u!]));

    // Group by department
    const deptMap = new Map<string, {
      cost: number;
      tokens: number;
      userIds: Set<string>;
      transactions: number;
    }>();

    transactions.forEach(transaction => {
      const user = userMap.get(transaction.userId);
      if (!user) return;

      const department = user.department;
      if (!deptMap.has(department)) {
        deptMap.set(department, {
          cost: 0,
          tokens: 0,
          userIds: new Set(),
          transactions: 0,
        });
      }

      const deptData = deptMap.get(department)!;
      deptData.cost += transaction.calculatedCost;
      deptData.tokens += transaction.tokenCount;
      deptData.userIds.add(transaction.userId);
      deptData.transactions += 1;
    });

    return Array.from(deptMap.entries()).map(([department, data]) => ({
      department,
      cost: parseFloat(data.cost.toFixed(2)),
      tokens: data.tokens,
      users: data.userIds.size,
      transactions: data.transactions,
    })).sort((a, b) => b.cost - a.cost);
  }

  async getTokenDistribution(params: DashboardQueryParams = {}): Promise<TokenDistribution[]> {
    const transactions = await this.transactionRepository.findAll({
      startDate: params.startDate,
      endDate: params.endDate,
      region: params.region,
    });

    // Group by token type
    const typeMap = new Map<string, { tokens: number; cost: number }>();

    transactions.forEach(transaction => {
      const type = transaction.tokenType;
      if (!typeMap.has(type)) {
        typeMap.set(type, { tokens: 0, cost: 0 });
      }

      const typeData = typeMap.get(type)!;
      typeData.tokens += transaction.tokenCount;
      typeData.cost += transaction.calculatedCost;
    });

    return Array.from(typeMap.entries()).map(([type, data]) => ({
      type,
      tokens: data.tokens,
      cost: parseFloat(data.cost.toFixed(2)),
    }));
  }

  async getTopUsers(params: DashboardQueryParams = {}, limit: number = 10): Promise<TopUser[]> {
    const transactions = await this.transactionRepository.findAll({
      startDate: params.startDate,
      endDate: params.endDate,
      region: params.region,
    });

    const userMap = new Map<string, {
      cost: number;
      tokens: number;
      transactions: number;
    }>();

    transactions.forEach(transaction => {
      if (!userMap.has(transaction.userId)) {
        userMap.set(transaction.userId, {
          cost: 0,
          tokens: 0,
          transactions: 0,
        });
      }

      const userData = userMap.get(transaction.userId)!;
      userData.cost += transaction.calculatedCost;
      userData.tokens += transaction.tokenCount;
      userData.transactions += 1;
    });

    const allUsers = await this.userRepository.findAll({});
    const userDetailsMap = new Map<string, any>();
    allUsers.forEach(user => {
      if (user && user.userId) {
        userDetailsMap.set(String(user.userId), user);
      }
    });

    const topUsers = Array.from(userMap.entries())
      .map(([userId, data]) => {
        const userIdStr = String(userId);
        const user = userDetailsMap.get(userIdStr);
        
        if (!user) {
          return {
            userName: `User ${userIdStr.substring(0, 8)}...`,
            company: 'Unknown',
            department: 'Unknown',
            region: 'Unknown',
            isProUser: false,
            cost: parseFloat(data.cost.toFixed(2)),
            tokens: data.tokens,
            transactions: data.transactions,
          };
        }

        return {
          userName: user.userName || `User ${userIdStr.substring(0, 8)}...`,
          company: user.companyName || 'Unknown',
          department: user.department || 'Unknown',
          region: user.region || 'Unknown',
          isProUser: user.isActiveSub || false,
          cost: parseFloat(data.cost.toFixed(2)),
          tokens: data.tokens,
          transactions: data.transactions,
        };
      })
      .sort((a, b) => b.cost - a.cost)
      .slice(0, limit);

    return topUsers;
  }

  async getUsageByCompany(params: DashboardQueryParams = {}): Promise<UsageByCompany[]> {
    const transactions = await this.transactionRepository.findAll({
      startDate: params.startDate,
      endDate: params.endDate,
      region: params.region,
    });

    const userIds = [...new Set(transactions.map(t => t.userId))];
    const users = await Promise.all(
      userIds.map(id => this.userRepository.findByUserId(id))
    );
    const userMap = new Map(users.filter(u => u).map(u => [u!.userId, u!]));

    // Group by company
    const companyMap = new Map<string, {
      cost: number;
      tokens: number;
      userIds: Set<string>;
      transactions: number;
    }>();

    transactions.forEach(transaction => {
      const user = userMap.get(transaction.userId);
      if (!user) return;

      const company = user.companyName;
      if (!companyMap.has(company)) {
        companyMap.set(company, {
          cost: 0,
          tokens: 0,
          userIds: new Set(),
          transactions: 0,
        });
      }

      const companyData = companyMap.get(company)!;
      companyData.cost += transaction.calculatedCost;
      companyData.tokens += transaction.tokenCount;
      companyData.userIds.add(transaction.userId);
      companyData.transactions += 1;
    });

    return Array.from(companyMap.entries()).map(([company, data]) => ({
      company,
      cost: parseFloat(data.cost.toFixed(2)),
      tokens: data.tokens,
      users: data.userIds.size,
      transactions: data.transactions,
    })).sort((a, b) => b.cost - a.cost);
  }

  async getRegions(): Promise<string[]> {
    return this.userRepository.getDistinctRegions();
  }

  async getDateRange(): Promise<DateRange> {
    const result = await this.transactionRepository.getDateRange();
    return result || { minDate: '', maxDate: '' };
  }
}

