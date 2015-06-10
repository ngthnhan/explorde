class UsersController < ApplicationController
  def index
  	@users = User.paginate(page: params[:page]).order("username")
  end

  def show
  	@user = User.friendly.find(params[:username])
  end
end
