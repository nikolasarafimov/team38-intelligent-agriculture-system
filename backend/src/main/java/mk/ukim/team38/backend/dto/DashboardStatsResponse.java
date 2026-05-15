package mk.ukim.team38.backend.dto;

public class DashboardStatsResponse {

    private long usersCount;
    private long cropsCount;
    private long parcelsCount;
    private long activitiesCount;

    public DashboardStatsResponse(long usersCount, long cropsCount, long parcelsCount, long activitiesCount) {
        this.usersCount = usersCount;
        this.cropsCount = cropsCount;
        this.parcelsCount = parcelsCount;
        this.activitiesCount = activitiesCount;
    }

    public long getUsersCount() {
        return usersCount;
    }

    public long getCropsCount() {
        return cropsCount;
    }

    public long getParcelsCount() {
        return parcelsCount;
    }

    public long getActivitiesCount() {
        return activitiesCount;
    }
}